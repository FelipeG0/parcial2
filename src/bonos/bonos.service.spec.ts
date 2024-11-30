/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { BonosService } from './bonos.service';
import { Bono } from './entities/bono.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Clase } from '../clases/entities/clase.entity';
import { faker } from '@faker-js/faker';

describe('BonosService', () => {
  let service: BonosService;
  let bonoRepository: Repository<Bono>;
  let usuarioRepository: Repository<Usuario>;
  let claseRepository: Repository<Clase>;
  let bonosList: Bono[];
  let usuario: Usuario;
  let clase: Clase;

  const seedDatabase = async () => {
    await bonoRepository.clear();
    await usuarioRepository.clear();
    await claseRepository.clear();

    usuario = await usuarioRepository.save({
      nCedula: faker.number.int(),
      nombre: faker.person.fullName(),
      grupoInvestigacion: 'TICSW',
      nExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
    });

    clase = await claseRepository.save({
      nombre: faker.company.name(),
      codigo: faker.string.alphanumeric(10).toUpperCase(),
      nCreditos: faker.number.int({ min: 1, max: 5 }),
    });

    bonosList = [];
    for (let i = 0; i < 5; i++) {
      const bono = await bonoRepository.save({
        monto: faker.number.int({ min: 1000, max: 10000 }),
        calificacion: faker.number.float({ min: 1, max: 5 }),
        palabraClave: faker.string.alpha(8),
        usuario,
        clase,
      });
      bonosList.push(bono);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonosService],
    }).compile();

    service = module.get<BonosService>(BonosService);
    bonoRepository = module.get<Repository<Bono>>(getRepositoryToken(Bono));
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    claseRepository = module.get<Repository<Clase>>(getRepositoryToken(Clase));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new bono', async () => {
    const bono: Bono = {
      id: null,
      monto: 5000,
      calificacion: 3.5,
      palabraClave: faker.string.alpha(8),
      usuario,
      clase,
    };

    const newBono: Bono = await service.create(bono);
    expect(newBono).not.toBeNull();

    const storedBono: Bono = await bonoRepository.findOne({ where: { id: newBono.id } });
    expect(storedBono).not.toBeNull();
    expect(storedBono.monto).toEqual(bono.monto);
    expect(storedBono.calificacion).toEqual(bono.calificacion);
    expect(storedBono.palabraClave).toEqual(bono.palabraClave);
  });

  it('findBonoByCodigoDeLaClase should return a bono by class code', async () => {
    const bono = bonosList[0];
    const foundBono = await service.findBonoByCodigoDeLaClase(clase.codigo);
    expect(foundBono).not.toBeNull();
    expect(foundBono.id).toEqual(bono.id);
  });

  it('findBonoByCodigoDeLaClase should throw an exception for an invalid class code', async () => {
    await expect(() => service.findBonoByCodigoDeLaClase('INVALID_CODE')).rejects.toHaveProperty(
      'message',
      'clase no encontrado.',
    );
  });

  it('findAllBonosByUsuario should return all bonos for a user', async () => {
    const bonos = await service.findAllBonosByUsuario(usuario.id);
    expect(bonos).not.toBeNull();
    expect(bonos).toHaveLength(bonosList.length);
  });

  it('deleteBono should remove a bono', async () => {
    const bono = bonosList[0];
    await service.deleteBono(bono.id);

    const deletedBono = await bonoRepository.findOne({ where: { id: bono.id } });
    expect(deletedBono).toBeNull();
  });

  it('deleteBono should throw an exception if the bono has a calificacion > 4', async () => {
    const bono = await bonoRepository.save({
      monto: 8000,
      calificacion: 4.5,
      palabraClave: faker.string.alpha(8),
      usuario,
      clase,
    });

    await expect(() => service.deleteBono(bono.id)).rejects.toHaveProperty(
      'message',
      'No se puede eliminar un bono con calificación mayor a 4.',
    );
  });

  it('deleteBono should throw an exception for an invalid bono', async () => {
    await expect(() => service.deleteBono(0)).rejects.toHaveProperty(
      'message',
      'Bono no encontrado.',
    );
  });
});
