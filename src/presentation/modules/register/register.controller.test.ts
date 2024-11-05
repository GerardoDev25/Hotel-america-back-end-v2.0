import { CreateRegisterDto, UpdateRegisterDto } from '@domain/dtos';
import {
  IGuest,
  IRegister,
  RegisterCheckOut,
  RegisterFilter,
  RegisterPagination,
} from '@domain/interfaces';
import { variables } from '@domain/variables';
import { Uuid } from '@src/adapters';
import { Generator } from '@src/utils/generator';
import { citiesList } from '@src/data/seed';
import { RegisterController } from './';

describe('register.controller.ts', () => {
  const mockRegister: IRegister = {
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

  const mockGuest: IGuest = {
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
    registerId: mockRegister.id,
  };

  const pagination: RegisterPagination = {
    registers: [mockRegister],
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

  it('should return registers by params (getByParams)', async () => {
    const body: RegisterFilter = {
      checkIn: Generator.randomDate(),
      discount: 12,
    };
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 }, body } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.getByParams(req, res);

    expect(mockService.getByParams).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should return error if params are wrong (getByParams)', async () => {
    const body: RegisterFilter = {
      checkIn: 'Generator.randomDate()',
      discount: -12,
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    const req = { query: { page: 1, limit: 10 }, body } as any;

    const mockService = { getByParams: jest.fn() } as any;
    const registerController = new RegisterController(mockService);

    await registerController.getByParams(req, res);

    expect(mockService.getByParams).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: [
        'discount property most be a positive',
        'checkIn property most have YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ format',
      ],
      ok: false,
    });
  });

  it('should throw error if not well paginated (getByParams)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getByParams: jest.fn() } as any;
    const registerController = new RegisterController(mockService);

    await registerController.getByParams(req, res);

    expect(mockService.getByParams).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return a register by id (getById)', async () => {
    const id = mockRegister.id;
    const req = { params: { id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(mockRegister),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(mockRegister);
  });

  it('should make checkIn successfully (checkIn)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...register } = mockRegister;
    const body = { userId: register.userId, register, guests: [guestDto] };

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const returnData = {
      ok: true,
      register: mockRegister,
      guests: [mockGuest],
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
    const { id, ...register } = mockRegister;
    const body = {
      userId: register.userId,
      register: { ...register, discount: true },
      guests: [guestDto],
    };

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const returnData = {
      ok: true,
      register: mockRegister,
      guests: [mockGuest],
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
    const { id, ...register } = mockRegister;
    const body = {
      userId: register.userId,
      register,
      guests: [{ ...guestDto, city: 4 }],
    };

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const returnData = {
      ok: true,
      register: mockRegister,
      guests: [mockGuest],
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

  it('should call checkOut function service (checkOut)', async () => {
    const req = { params: { id: mockRegister.id } } as any;
    const res = { json: jest.fn() } as any;

    const registerCheckOutDetail: RegisterCheckOut = {
      id: Uuid.v4(),
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
      discount: 0,
      price: 0,
      roomNumber: 0,
      totalCharges: 0,
      totalPayments: 0,
      guests: [],
      charges: [],
      payments: [],
    };

    const mockService = {
      checkOut: jest
        .fn()
        .mockResolvedValue({ ok: true, registerCheckOutDetail }),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.checkOut(req, res);

    expect(mockService.checkOut).toHaveBeenCalledWith(mockRegister.id);
    expect(res.json).toHaveBeenCalledWith({ ok: true, registerCheckOutDetail });
  });

  it('should update a register (update)', async () => {
    const req = { body: { id: mockRegister.id } } as any;
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
    const req = { params: { id: mockRegister.id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      delete: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const registerController = new RegisterController(mockService);

    await registerController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(mockRegister.id);
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
  });
});
