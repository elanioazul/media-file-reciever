import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeCamFile } from './entities/treecam-file.entity';
import { Camera } from './entities/camera.entity';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { TreeCamFiletDto } from './dto/treecam-file.dto';

@Injectable()
export class FileManagementService {
  constructor(
    @InjectRepository(TreeCamFile)
    private readonly treeCamFileRepository: Repository<TreeCamFile>,
    @InjectRepository(TreeCamFile)
    private readonly cameraRepository: Repository<Camera>,
    @InjectRepository(TreeCamFile)
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
    const file = this.treeCamFileRepository.find({
      where: { id: +id },
      relations: {
        camera: true,
      },
    });
    if (!file) {
      throw new NotFoundException(`TeeCamFile ${id} is not found in db`);
    }
    return file;
  }

  async create(treeCamFiletDto: TreeCamFiletDto) {
    const camera = await this.preloadCamera(treeCamFiletDto);
    const owner = await this.preloadOwner(treeCamFiletDto);
    const file = this.treeCamFileRepository.create({
      ...treeCamFiletDto,
      camera,
    });
    const newCamRegistry = this.cameraRepository.create({
      ...treeCamFiletDto,
      owner,
    });
    this.cameraRepository.save(newCamRegistry);
    return this.treeCamFileRepository.save(file);
  }

  async remove(id: string) {
    const coffeeIndex = await this.findOne(id);
    return this.treeCamFileRepository.remove(coffeeIndex);
  }

  private async preloadCamera(
    treeCamFiletDto: TreeCamFiletDto,
  ): Promise<Camera> {
    const existingCamera = await this.cameraRepository.findOne({
      where: { alias: treeCamFiletDto.camAlias },
    });
    if (existingCamera) {
      return existingCamera;
    }
    return this.cameraRepository.create({
      alias: treeCamFiletDto.camAlias,
      brand: treeCamFiletDto.camBrand,
      model: treeCamFiletDto.camModel,
      hasLocationFeat: treeCamFiletDto.camHasGeoCapabilities,
    });
  }

  private isARegisteredOwer(treeCamFiletDto: TreeCamFiletDto): boolean {
    const existingOwner = this.ownersRepository.findOne({
      where: { dni: treeCamFiletDto.ownerDni },
    });
    return existingOwner ? true : false;
  }

  private async preloadOwner(treeCamFiletDto: TreeCamFiletDto): Promise<Owner> {
    const existingOwner = await this.ownersRepository.findOne({
      where: { dni: treeCamFiletDto.ownerDni },
    });
    if (existingOwner) {
      return existingOwner;
    }
    return this.ownersRepository.create({
      name: treeCamFiletDto.ownerName,
      surname: treeCamFiletDto.ownerSurname,
      dni: treeCamFiletDto.ownerDni,
      telegram_user: treeCamFiletDto.ownerTelegramUser,
      email: treeCamFiletDto.ownerEmail,
      phone: treeCamFiletDto.ownerPhone,
    });
  }
}
