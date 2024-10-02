import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos/register';
import { GuestEntity, RegisterEntity } from '@domain/entities';
import { RegisterPagination } from '@domain/interfaces';
import { variables } from '@domain/variables';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { RegisterController } from './';

describe('register.controller.ts', () => {
  const registerEntity: RegisterEntity = {
    id: Uuid.v4(),
    checkIn: Generator.randomDate(),
    guestsNumber: 1,
    discount: 0,
    price: 0,
    userId: Uuid.v4(),
    roomId: Uuid.v4(),
  };

  const fullName = Generator.randomName();

  const guestDto = {
    di: Generator.randomIdentityNumber(),
    city: Generator.randomCity(citiesList),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    phone: Generator.randomPhone(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    countryId: 'AR',
    dateOfBirth: new Date().toISOString().split('T')[0],
  };

  const guestEntity = new GuestEntity({
    id: guestDto.di,
    di: guestDto.di,
    checkIn: new Date().toISOString(),
    checkOut: new Date().toISOString(),
    dateOfBirth: new Date().toISOString(),
    city: guestDto.city,
    name: guestDto.name,
    lastName: guestDto.lastName,
    phone: guestDto.phone,
    roomNumber: guestDto.roomNumber,
    countryId: guestDto.countryId,
    registerId: registerEntity.id,
  });

  const pagination: RegisterPagination = {
    registers: [registerEntity],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  it('should return all register (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 } } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error if not well paginated (getAll)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getAll: jest.fn() } as any;
    const registerController = new RegisterController(mockService);

    await registerController.getAll(req, res);

    expect(mockService.getAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return a register by id (getById)', async () => {
    const id = registerEntity.id;
    const req = { params: { id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(registerEntity),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(registerEntity);
  });

  it('should create a register (create)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...body } = registerEntity;

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      create: jest.fn().mockResolvedValue(registerEntity),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.create(req, res);

    expect(res.json).toHaveBeenCalledWith(registerEntity);
    expect(mockService.create).toHaveBeenCalledWith(
      expect.any(CreateRegisterDto)
    );
  });

  it('should throw error if not well create (create)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { create: jest.fn() } as any;
    const registerController = new RegisterController(mockService);

    await registerController.create(req, res);

    expect(mockService.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: expect.any(Array),
    });
  });

  it('should make checkIn successfully (checkIn)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...register } = registerEntity;
    const body = { userId: register.userId, register, guests: [guestDto] };

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const returnData = {
      ok: true,
      register: registerEntity,
      guests: [guestEntity],
    };
    const mockService = {
      checkIn: jest.fn().mockResolvedValue(returnData),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.checkIn(req, res);

    expect(res.json).toHaveBeenCalledWith(returnData);
    expect(mockService.checkIn).toHaveBeenCalledWith({
      registerDto: expect.any(CreateRegisterDto),
      guestDtos: expect.any(Array),
    });
  });

  it('should get error if request object is not valid (checkIn)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { checkIn: jest.fn() } as any;
    const registerController = new RegisterController(mockService);

    await registerController.checkIn(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: [
        'register object required',
        'guests array required or not valid',
      ],
    });
    expect(mockService.checkIn).not.toHaveBeenCalled();
  });

  it('should get error if register object is not valid (checkIn)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...register } = registerEntity;
    const body = {
      userId: register.userId,
      register: { ...register, discount: true },
      guests: [guestDto],
    };

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const returnData = {
      ok: true,
      register: registerEntity,
      guests: [guestEntity],
    };
    const mockService = {
      checkIn: jest.fn().mockResolvedValue(returnData),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.checkIn(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['discount property most be a number'],
    });
    expect(mockService.checkIn).not.toHaveBeenCalled();
  });

  it('should get error if guests array is not valid (checkIn)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...register } = registerEntity;
    const body = {
      userId: register.userId,
      register,
      guests: [{ ...guestDto, city: 4 }],
    };

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const returnData = {
      ok: true,
      register: registerEntity,
      guests: [guestEntity],
    };
    const mockService = {
      checkIn: jest.fn().mockResolvedValue(returnData),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.checkIn(req, res);

    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['city property most be a string'],
    });
    expect(mockService.checkIn).not.toHaveBeenCalled();
  });

  it('should update a register (update)', async () => {
    const req = { body: { id: registerEntity.id } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      update: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.update(req, res);

    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
    expect(mockService.update).toHaveBeenCalledWith(
      expect.any(UpdateRegisterDto)
    );
  });

  it('should throw error if not valid object (update)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { update: jest.fn() } as any;
    const registerController = new RegisterController(mockService);

    await registerController.update(req, res);

    expect(mockService.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['id property is required'],
      ok: false,
    });
  });

  it('should call delete function service (delete)', async () => {
    const req = { params: { id: registerEntity.id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      delete: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(registerEntity.id);
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
  });
});
