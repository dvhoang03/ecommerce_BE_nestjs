import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {

  constructor( @InjectRepository(User) private readonly userRepository: Repository<User>){}


  async create(createUserDto: CreateUserDto) : Promise<User>{
    const user = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll() : Promise<User[]>{
    return await this.userRepository.find();
  }

  async findOne(id: number) : Promise<User | null>{
    const user = await this.userRepository.findOne({ 
      where:{id},
    });
    if(!user) throw new NotFoundException(" not find user ")
    return  user ;
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<User|null>{
    var user = await this.userRepository.findOne({where:{id}});
    if(!user){
      throw new  NotFoundException("not find product");
    }
    await this.userRepository.update(id,updateUserDto);
    return await this.userRepository.findOne({where:{id}});
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }

  async findBy(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where:{email} });
  }

}
