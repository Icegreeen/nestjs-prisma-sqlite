import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BookDTO } from './book.dto';
import { PrismaService } from 'src/database/PrismaService';

@Injectable()
export class BookService {
    constructor(private prisma: PrismaService) {}

    async create(data: BookDTO) {
        const bookExists = await this.prisma.book.findFirst({
            where: {
                bar_code: data.bar_code
            }
        });

        if(bookExists) {
            throw new ConflictException('Book already exists!');
        }

        const book = await this.prisma.book.create({
            data: {
                title: data.title,
                description: data.description,
                bar_code: data.bar_code,
            }
        });

        return book;
    }

    async findAll() {
        return this.prisma.book.findMany();
    }

    async update(id: string, data: BookDTO) {
        const bookExists = await this.prisma.book.findUnique({
            where: { id,}
        });

        if(!bookExists) {throw new Error("Book does not exists!");}

        return await this.prisma.book.update({
            data,
            where: {
                id,
            }
        })
    }

    async delete(id: string) {
        const bookExists = await this.prisma.book.findUnique({
          where: {
            id,
          }
        });

        if(!bookExists) {
            throw new Error('Error does not exists or deleted!');
        }

        return await this.prisma.book.delete({
            where: {
                id,
            }
        });
     }
}
