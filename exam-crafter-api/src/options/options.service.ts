import { Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Option } from './entities/option.entity';

type SettingsType = {
  classe?: string | undefined;
  filiere?: string | undefined;
  bound_to: string;
};

@Injectable()
export class OptionsService {
  constructor(@InjectModel('Option') private optionModel: Model<Option>) {}

  async create(createOptionDto: CreateOptionDto): Promise<Option> {
    const createdOption = new this.optionModel(createOptionDto);
    return createdOption.save();
  }

  async findAll({ classe, filiere, bound_to }: SettingsType) {
    const options = await this.optionModel.find({
      classe,
      filiere,
      bound_to,
    });
    return options;
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }

  update(id: number, updateOptionDto: UpdateOptionDto) {
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
