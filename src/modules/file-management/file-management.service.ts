import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeCamFile } from './entities/treecam-file.entity';
import { Camera } from './entities/camera.entity';
import { Owner } from './entities/owner.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { TreeCamFiletDto } from './dto/treecam-file.dto';
import { Multer } from 'multer';
import { TelegramAccount } from '../bot-management/entities/telegram-account';
import { TelegramService } from '../bot-management/services/telegram/telegram.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class FileManagementService {
  constructor(
    private readonly telegramService: TelegramService,
    @InjectRepository(TreeCamFile)
    private readonly treeCamFileRepository: Repository<TreeCamFile>,
    @InjectRepository(Camera)
    private readonly cameraRepository: Repository<Camera>,
    @InjectRepository(Owner)
    private readonly ownersRepository: Repository<Owner>,
    @InjectRepository(TelegramAccount)
    private readonly telegramRepository: Repository<TelegramAccount>,
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

    const account = await this.preloadTelegramAccount(treeCamFiletDto);
    const owner = await this.preloadOwner(treeCamFiletDto, account);
    const camera = await this.preloadCamera(treeCamFiletDto, owner);

    this.telegramService
      .manageFile(mimetype, filename, account.chat_id)
      .pipe(
        tap((data) => console.log('Successful managing file:', data)),
        catchError((error) => {
          console.error('Error managing file:', error);
          return [];
        }),
      )
      .subscribe();

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

  private async preloadTelegramAccount(
    treeCamFiletDto: TreeCamFiletDto,
  ): Promise<TelegramAccount> {
    const existingAccount = await this.telegramRepository.findOne({
      where: { username: treeCamFiletDto.ownerTelegramUser },
    });

    if (existingAccount) {
      return existingAccount;
    }

    try {
      const newAccount = this.telegramRepository.create({
        username: treeCamFiletDto.ownerTelegramUser,
      });
      await this.telegramRepository.save(newAccount);
      return newAccount;
    } catch (error) {
      throw error;
    }
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

  private async preloadOwner(
    treeCamFiletDto: TreeCamFiletDto,
    account: TelegramAccount,
  ): Promise<Owner> {
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
        telegram: account,
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
