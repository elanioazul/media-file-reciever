import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeCamFile } from './entities/treecam-file.entity';
import { Camera } from './entities/camera.entity';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { TreeCamFiletDto } from './dto/treecam-file.dto';
import { Multer } from 'multer';

@Injectable()
export class FileManagementService {
  constructor(
    @InjectRepository(TreeCamFile)
    private readonly treeCamFileRepository: Repository<TreeCamFile>,
    @InjectRepository(Camera)
    private readonly cameraRepository: Repository<Camera>,
    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.treeCamFileRepository.find({
      relations: {
        camera: true,
      },
      skip: offset,
      take: limit,
    });
  }
  async findOne(id: string) {
    const files = await this.treeCamFileRepository.find({
      where: { filename: id },
      relations: {
        camera: true,
      },
    });
    if (!files || files.length === 0) {
      throw new NotFoundException(`TeeCamFile ${id} is not found in db`);
    }
    return files[0];
  }

  async create(
    treeCamFiletDto: TreeCamFiletDto,
    multerFile: Express.Multer.File,
  ) {
    const {
      originalname,
      encoding,
      mimetype,
      destination,
      filename,
      path,
      size,
    } = multerFile;

    const owner = await this.preloadOwner(treeCamFiletDto);
    const camera = await this.preloadCamera(treeCamFiletDto, owner);

    const file = this.treeCamFileRepository.create({
      originalname,
      filename,
      path,
      mimetype,
      size,
      camera,
    });
    return this.treeCamFileRepository.save(file);
  }

  async remove(id: string) {
    const coffeeIndex = await this.findOne(id);
    return this.treeCamFileRepository.remove(coffeeIndex);
  }

  private async preloadCamera(
    treeCamFiletDto: TreeCamFiletDto,
    owner: Owner,
  ): Promise<Camera> {
    const existingCam = await this.cameraRepository.findOne({
      where: { alias: treeCamFiletDto.camAlias },
    });

    if (existingCam) {
      return existingCam;
    }

    try {
      const newCam = this.cameraRepository.create({
        alias: treeCamFiletDto.camAlias,
        brand: treeCamFiletDto.camBrand,
        model: treeCamFiletDto.camModel,
        hasLocationFeat: treeCamFiletDto.camHasGeoCapabilities,
        owner,
      });
      await this.cameraRepository.save(newCam);
      return newCam;
    } catch (error) {
      throw error;
    }
  }

  private async preloadOwner(treeCamFiletDto: TreeCamFiletDto): Promise<Owner> {
    const existingOwner = await this.ownersRepository.findOne({
      where: { dni: treeCamFiletDto.ownerDni },
    });

    if (existingOwner) {
      return existingOwner;
    }

    try {
      const newOwner = this.ownersRepository.create({
        name: treeCamFiletDto.ownerName,
        surname: treeCamFiletDto.ownerSurname,
        dni: treeCamFiletDto.ownerDni,
        telegram_user: treeCamFiletDto.ownerTelegramUser,
        email: treeCamFiletDto.ownerEmail,
        phone: treeCamFiletDto.ownerPhone,
      });
      await this.ownersRepository.save(newOwner);
      return newOwner;
    } catch (error) {
      throw error;
    }
  }
}
