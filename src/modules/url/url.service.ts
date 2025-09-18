import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from 'src/services/uid/uid.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { GetUrlsDto } from './dto/get-urls.dto';

@Injectable()
export class UrlService {
  private host: string;
  constructor(
    private readonly uidService: UidService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.host = this.configService.getOrThrow<string>(`host`);
  }
  async create(createUrlDto: CreateUrlDto) {
    const randomId = this.uidService.generate(5);
    const url = await this.databaseService.url.create({
      data: {
        ...createUrlDto,
        url: `${this.host}/${randomId}`,
      },
    });
    return url;
  }

  async findAll({ filter, page = 1, limit = 20 }: GetUrlsDto) {
    //filtering/searching
    const whereClause = filter
      ? {
          OR: [
            {
              title: { contains: filter },
            },
            {
              description: { contains: filter },
            },
            {
              redirect: { contains: filter },
            },
          ],
        }
      : {};
    //pagination
    const skip = (page - 1) * limit;
    const data = await this.databaseService.url.findMany({
      where: whereClause,
      take: limit,
      skip,
    });
    const totalCount = await this.databaseService.url.count();

    let baseUrl = `${this.host}/url?limit=${limit}`;
    if (filter) {
      baseUrl += `&filter=${encodeURIComponent(filter)}`;
    }
    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages ? `${baseUrl}&page=${page + 1}` : null;
    const previousPage = page > 1 ? `${baseUrl}&page=${page - 1}` : null;

    const meta = {
      totalCount,
      currentPage: page,
      itemsPerPage: limit,
      totalPages,
      nextPage,
      previousPage,
    };

    return {
      data,
      meta,
    };
  }

  async findOne(id: string) {
    return await this.databaseService.url.findUnique({
      where: { url: `${this.host}/${id}` },
    });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return await this.databaseService.url.update({
      where: { id },
      data: updateUrlDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.url.delete({
      where: { id },
    });
  }
}
