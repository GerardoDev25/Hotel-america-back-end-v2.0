import { CreateGuestDto, UpdateGuestDto } from '@domain/dtos/guest';
import { GuestEntity } from '@domain/entities';
import { GuestFilter, GuestPagination } from '@domain/interfaces';
import { variables } from '@domain/variables';
import { Uuid } from '@src/adapters';
import { citiesList } from '@src/data/seed';
import { Generator } from '@src/utils/generator';
import { GuestController } from '.';

describe('guest.controller.ts', () => {
  const fullName = Generator.randomName();

  const guestEntity: GuestEntity = {
    id: Uuid.v4(),
    di: Generator.randomIdentityNumber(),
    checkIn: Generator.randomDate(),
    checkOut: Generator.randomDate(),
    dateOfBirth: Generator.randomDate(),
    city: Generator.randomCity(citiesList),
    name: fullName.split(' ').at(0)!,
    lastName: fullName.split(' ').at(1)!,
    phone: Generator.randomPhone(),
    roomNumber: variables.ROOM_NUMBER_MIN_VALUE,
    countryId: 'AR',
    registerId: Uuid.v4(),
  };

  const pagination: GuestPagination = {
    guests: [guestEntity],
    total: 0,
    page: 0,
    limit: 0,
    prev: null,
    next: null,
  };

  it('should return all guests (getAll)', async () => {
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 } } as any;

    const mockService = {
      getAll: jest.fn().mockResolvedValue(pagination),
    } as any;
    const guestController = new GuestController(mockService);

    await guestController.getAll(req, res);

    expect(mockService.getAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error if not well paginated (getAll)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getAll: jest.fn() } as any;
    const guestController = new GuestController(mockService);

    await guestController.getAll(req, res);

    expect(mockService.getAll).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return guests (getByParams)', async () => {
    const body: GuestFilter = {
      city: 'Cordoba',
      checkIn: Generator.randomDate(),
      checkOut: Generator.randomDate(),
    };
    const res = { json: jest.fn() } as any;
    const req = { query: { page: 1, limit: 10 }, body } as any;

    const mockService = {
      getByParams: jest.fn().mockResolvedValue(pagination),
    } as any;
    const guestController = new GuestController(mockService);

    await guestController.getByParams(req, res);

    expect(mockService.getByParams).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(pagination);
  });

  it('should throw error if not well paginated (getByParams)', async () => {
    const req = { query: { page: false, limit: null } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { getByParams: jest.fn() } as any;
    const guestController = new GuestController(mockService);

    await guestController.getByParams(req, res);

    expect(mockService.getByParams).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: ['Page must be greaten than 0'],
    });
  });

  it('should return a register by id (getById)', async () => {
    const id = guestEntity.id;
    const req = { params: { id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      getById: jest.fn().mockResolvedValue(guestEntity),
    } as any;
    const guestController = new GuestController(mockService);

    await guestController.getById(req, res);

    expect(mockService.getById).toHaveBeenCalledWith(id);
    expect(res.json).toHaveBeenCalledWith(guestEntity);
  });

  it('should create a register (create)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...body } = guestEntity;

    const req = { body } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      create: jest.fn().mockResolvedValue(guestEntity),
    } as any;
    const guestController = new GuestController(mockService);

    await guestController.create(req, res);

    expect(res.json).toHaveBeenCalledWith(guestEntity);
    expect(mockService.create).toHaveBeenCalledWith(expect.any(CreateGuestDto));
  });

  it('should throw error if not well create (create)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { create: jest.fn() } as any;
    const guestController = new GuestController(mockService);

    await guestController.create(req, res);

    expect(mockService.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      ok: false,
      errors: expect.any(Array),
    });
  });

  it('should update a register (update)', async () => {
    const req = { body: { id: guestEntity.id } } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = {
      update: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const guestController = new GuestController(mockService);

    await guestController.update(req, res);

    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
    expect(mockService.update).toHaveBeenCalledWith(expect.any(UpdateGuestDto));
  });

  it('should throw error if not valid object (update)', async () => {
    const req = { body: {} } as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;

    const mockService = { update: jest.fn() } as any;
    const guestController = new GuestController(mockService);

    await guestController.update(req, res);

    expect(mockService.update).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      errors: ['id property is required'],
      ok: false,
    });
  });

  it('should call delete function service (delete)', async () => {
    const req = { params: { id: guestEntity.id } } as any;
    const res = { json: jest.fn() } as any;

    const mockService = {
      delete: jest.fn().mockResolvedValue({ ok: true, message: '' }),
    } as any;
    const guestController = new GuestController(mockService);

    await guestController.delete(req, res);

    expect(mockService.delete).toHaveBeenCalledWith(guestEntity.id);
    expect(res.json).toHaveBeenCalledWith({ ok: true, message: '' });
  });
});
