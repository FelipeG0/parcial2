/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { UsuariosService } from './usuarios.service';
import { Usuario } from './entities/usuario.entity';
import { BonosService } from '../bonos/bonos.service';
import { faker } from '@faker-js/faker';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let usuarioRepository: Repository<Usuario>;
  let mockBonosService: Partial<BonosService>;
  let usuariosList: Usuario[];

  const seedDatabase = async () => {
    await usuarioRepository.clear();
    usuariosList = [];
    for (let i = 0; i < 5; i++) {
      const usuario = await usuarioRepository.save({
        nCedula: faker.datatype.number(),
        nombre: faker.name.fullName(),
        grupoInvestigacion: i % 2 === 0 ? 'TICSW' : 'IMAGINE',
        nExtension: faker.datatype.number(),
        rol: i % 2 === 0 ? 'Profesor' : 'Decana',
      });
      usuariosList.push(usuario);
    }
  };

  beforeEach(async () => {
    mockBonosService = {
      findAllBonosByUsuario: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        UsuariosService,
        { provide: BonosService, useValue: mockBonosService },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    usuarioRepository = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should return a new usuario with valid data', async () => {
    const usuario: Usuario = {
      id: null,
      nCedula: faker.datatype.number(),
      nombre: faker.name.fullName(),
      grupoInvestigacion: 'TICSW',
      nExtension: 12345678,
      rol: 'Profesor',
      jefe: null,
      bonos: [],
      clases: [],
    };

    const newUsuario: Usuario = await service.create(usuario);
    expect(newUsuario).not.toBeNull();

    const storedUsuario: Usuario = await usuarioRepository.findOne({ where: { id: newUsuario.id } });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.nombre).toEqual(usuario.nombre);
    expect(storedUsuario.rol).toEqual(usuario.rol);
    expect(storedUsuario.grupoInvestigacion).toEqual(usuario.grupoInvestigacion);
  });

  it('create should throw an exception for invalid grupoInvestigacion for Profesor', async () => {
    const usuario: Usuario = {
      id: null,
      nCedula: faker.datatype.number(),
      nombre: faker.name.fullName(),
      grupoInvestigacion: 'INVALID_GROUP',
      nExtension: 12345678,
      rol: 'Profesor',
      jefe: null,
      bonos: [],
      clases: [],
    };

    await expect(service.create(usuario)).rejects.toThrow('Grupo de investigación inválido para profesores');
  });

  it('create should throw an exception for invalid nExtension for Decana', async () => {
    const usuario: Usuario = {
      id: null,
      nCedula: faker.datatype.number(),
      nombre: faker.name.fullName(),
      grupoInvestigacion: null,
      nExtension: 123,
      rol: 'Decana',
      jefe: null,
      bonos: [],
      clases: [],
    };

    await expect(service.create(usuario)).rejects.toThrow('El numero debe tener 8 digitos');
  });

  it('findById should return a usuario by id', async () => {
    const storedUsuario: Usuario = usuariosList[0];
    const usuario: Usuario = await service.findById(storedUsuario.id);
    expect(usuario).not.toBeNull();
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
    expect(usuario.nCedula).toEqual(storedUsuario.nCedula);
  });

  it('findById should throw an exception for an invalid id', async () => {
    await expect(() => service.findById(0)).rejects.toHaveProperty('message', 'The user with the given id was not found');
  });

  it('remove should delete a usuario with valid conditions', async () => {
    const usuario: Usuario = usuariosList[0];
    jest.spyOn(mockBonosService, 'findAllBonosByUsuario').mockResolvedValue([]);
    await service.remove(usuario.id);

    const deletedUsuario = await usuarioRepository.findOne({ where: { id: usuario.id } });
    expect(deletedUsuario).toBeNull();
  });

  it('remove should throw an exception if the usuario is a Decana', async () => {
    const usuario: Usuario = usuariosList.find((u) => u.rol === 'Decana');
    jest.spyOn(mockBonosService, 'findAllBonosByUsuario').mockResolvedValue([]);

    await expect(() => service.remove(usuario.id)).rejects.toThrow('No se puede eliminar un usuario Decana o con bonos');
  });

  it('remove should throw an exception if the usuario has bonos', async () => {
    const usuario: Usuario = usuariosList[0];
    jest.spyOn(mockBonosService, 'findAllBonosByUsuario').mockResolvedValue([{
        id: 1,
        monto: 5000,
        calificacion: 4,
        palabraClave: 'BONO',
        usuario: usuario,
        clase: null,
    }]);

    await expect(() => service.remove(usuario.id)).rejects.toThrow('No se puede eliminar un usuario Decana o con bonos');
  });
});
