import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  Query,
  Body,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImagesService } from './images.service';
import { Images } from './images.entity';
import * as fs from 'fs';

// Multer configuration
const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('eventId') eventId?: number,
    @Body('jobId') jobId?: number,
  ): Promise<Images> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate that either eventId or jobId is provided, but not both
    if (eventId && jobId) {
      throw new BadRequestException('Cannot associate upload with both event and job');
    }

    if (!eventId && !jobId) {
      throw new BadRequestException('Must provide either eventId or jobId');
    }

    const uploadData: Partial<Images> = {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      eventId,
      jobId,
    };

    return this.imagesService.create(uploadData);
  }

  @Get()
  async findAll(): Promise<Images[]> {
    return this.imagesService.findAll();
  }

  @Get('event/:eventId')
  async findByEventId(@Param('eventId') eventId: number): Promise<Images[]> {
    return this.imagesService.findByEventId(Number(eventId));
  }

  @Get('job/:jobId')
  async findByJobId(@Param('jobId') jobId: number): Promise<Images[]> {
    return this.imagesService.findByJobId(Number(jobId));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Images> {
    const upload = await this.imagesService.findOne(Number(id));
    if (!upload) {
      throw new BadRequestException('Upload not found');
    }
    return upload;
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const filePath = await this.imagesService.getFilePath(Number(id));
    const upload = await this.imagesService.findOne(Number(id));
    
    if (!upload) {
      throw new BadRequestException('Upload not found');
    }

    res.setHeader('Content-Type', upload.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${upload.originalName}"`);
    res.sendFile(filePath);
  }

  @Get(':id/view')
  async viewFile(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const filePath = await this.imagesService.getFilePath(Number(id));
    const upload = await this.imagesService.findOne(Number(id));
    
    if (!upload) {
      throw new BadRequestException('Upload not found');
    }

    res.setHeader('Content-Type', upload.mimetype);
    res.sendFile(filePath);
  }

  @Put(':id/associate-event')
  async associateWithEvent(
    @Param('id') id: number,
    @Body('eventId') eventId: number,
  ): Promise<Images> {
    if (!eventId) {
      throw new BadRequestException('eventId is required');
    }
    return this.imagesService.associateWithEvent(Number(id), Number(eventId));
  }

  @Put(':id/associate-job')
  async associateWithJob(
    @Param('id') id: number,
    @Body('jobId') jobId: number,
  ): Promise<Images> {
    if (!jobId) {
      throw new BadRequestException('jobId is required');
    }
    return this.imagesService.associateWithJob(Number(id), Number(jobId));
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.imagesService.remove(Number(id));
    return { message: 'Upload deleted successfully' };
  }
}
