import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { Response } from 'express';
import { UrlExistsPipe } from './pipes/url-exists/url-exists.pipe';
import { Url } from '@prisma/client';
import { GetUrlsDto } from './dto/get-urls.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post(`url`)
  @UseGuards(AuthGuard)
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlService.create(createUrlDto);
  }

  @Get(`url`)
  @UseGuards(AuthGuard)
  findAll(@Query() queryParams: GetUrlsDto) {
    return this.urlService.findAll(queryParams);
  }

  @Get(':id')
  findOne(@Param('id', UrlExistsPipe) url: Url, @Res() res: Response) {
    return res.redirect(url.redirect);
  }

  @Patch('url/:id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', UrlExistsPipe) url: Url,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    return this.urlService.update(url.id, updateUrlDto);
  }

  @Delete('url/:id')
  @UseGuards(AuthGuard)
  remove(@Param('id', UrlExistsPipe) url: Url) {
    return this.urlService.remove(url.id);
  }
}
