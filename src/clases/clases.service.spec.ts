/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ClasesService } from './clases.service';
import { Clase } from './entities/clase.entity';
import { faker } from '@faker-js/faker';

describe('ClasesService', () => {
  let service: ClasesService;
  let repository: Repository<Clase>;
  let clasesList: Clase[];

  const seedDatabase = async () => {
    await repository.clear();
    clasesList = [];
    for (let i = 0; i < 5; i++) {
      const clase = await repository.save({
        nombre: faker.company.name(),
        codigo: faker.datatype.string(10),
        nCreditos: faker.datatype.number(),
        bonos: [],
        usuario: null,
      });
      clasesList.push(clase);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClasesService],
    }).compile();

    service = module.get<ClasesService>(ClasesService);
    repository = module.get<Repository<Clase>>(getRepositoryToken(Clase));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findById should return a class by id', async () => {
    const storedClass: Clase = clasesList[0];
    const clase: Clase = await service.findById(storedClass.id);
    expect(clase).not.toBeNull();
    expect(clase.nombre).toEqual(storedClass.nombre);
    expect(clase.codigo).toEqual(storedClass.codigo);
    expect(clase.nCreditos).toEqual(storedClass.nCreditos);
  });

  it('findById should throw an exception for an invalid id', async () => {
    await expect(() => service.findById(0)).rejects.toHaveProperty(
      'message',
      'The class with the given id was not found',
    );
  });

  it('create should return a new class', async () => {
    const clase: Clase = {
      id: null,
      nombre: faker.company.name(),
      codigo: faker.datatype.string(10),
      nCreditos: faker.datatype.number(),
      bonos: [],
      usuario: null,
    };

    const newClase: Clase = await service.create(clase);
    expect(newClase).not.toBeNull();

    const storedClase: Clase = await repository.findOne({
      where: { id: newClase.id },
    });
    expect(storedClase).not.toBeNull();
    expect(storedClase.nombre).toEqual(clase.nombre);
    expect(storedClase.codigo).toEqual(clase.codigo);
    expect(storedClase.nCreditos).toEqual(clase.nCreditos);
  });

  it('create should throw an error when trying to save a class with missing fields ', async () => {
    const clase: Partial<Clase> = {
      nombre: null, 
      codigo: faker.datatype.string(10),
      nCreditos: faker.datatype.number(),
    };

    await expect(service.create(clase as Clase)).rejects.toThrow();
  });
});
