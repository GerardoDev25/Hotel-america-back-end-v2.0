import { Uuid } from '../../adapters';
import { CreateRoomDto, UpdateRoomDto } from '../dtos/room';
import { RoomEntity } from '../entities';
import { RoomPagination, RoomTypesList } from '../interfaces';
import { RoomRepository } from './room.repository';
describe('room.repository.ts', () => {
  const page = 2;
  const limit = 10;
  const isAvailable = true;

  const mockRoom: RoomEntity = new RoomEntity({
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  });
  const mockRoom2: RoomEntity = new RoomEntity({
    id: 'abc',
    roomType: RoomTypesList.NORMAL,
    roomNumber: 12,
    betsNumber: 12,
    isAvailable: true,
  });

  const getAllReturnValue = {
    rooms: [mockRoom, mockRoom2],
    limit,
    next: '',
    page,
    prev: '',
    total: 0,
  };
  class MockRoomRepository implements RoomRepository {
    async getAll(
      page: number,
      limit: number,
      isAvailable: boolean
    ): Promise<RoomPagination> {
      return getAllReturnValue;
    }

    async getById(id: string): Promise<{ ok: boolean; room: RoomEntity }> {
      return { ok: true, room: mockRoom };
    }
    async create(
      createRoomDto: CreateRoomDto
    ): Promise<{ ok: boolean; room: RoomEntity }> {
      return { ok: true, room: mockRoom2 };
    }
    async update(
      updateRoomDto: UpdateRoomDto
    ): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'update' };
    }
    async delete(id: string): Promise<{ ok: boolean; message: string }> {
      return { ok: true, message: 'delete' };
    }
  }

  test('test in function getAll()', async () => {
    const mockRoomRepository = new MockRoomRepository();

    expect(typeof mockRoomRepository.getAll).toBe('function');
    const { rooms } = await mockRoomRepository.getAll(page, limit, isAvailable);

    expect(
      mockRoomRepository.getAll(page, limit, isAvailable)
    ).resolves.toEqual(getAllReturnValue);


    expect(rooms).toBeInstanceOf(Array);
    expect(rooms).toHaveLength(2);
    rooms.forEach((room) => {
      expect(room).toBeInstanceOf(RoomEntity);
    });
  });

  test('test in function create()', async () => {
    const mockRoomRepository = new MockRoomRepository();

    const { id, ...rest } = mockRoom;

    const { ok, room } = await mockRoomRepository.create(rest);

    expect(ok).toBeTruthy();
    expect(room).toBeInstanceOf(RoomEntity);
    expect(typeof mockRoomRepository.create).toBe('function');
    expect(mockRoomRepository.create(rest)).resolves.toEqual({
      ok: true,
      room: mockRoom2,
    });
  });

  test('test in function update()', async () => {
    const mockRoomRepository = new MockRoomRepository();

    const { ok, message } = await mockRoomRepository.update(mockRoom);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockRoomRepository.update).toBe('function');
    expect(mockRoomRepository.update(mockRoom)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  test('test in function delete()', async () => {
    const id = Uuid.v4()
    const mockRoomRepository = new MockRoomRepository();
    const { ok, message } = await mockRoomRepository.delete(id);

    expect(ok).toBeTruthy();
    expect(typeof message).toBe('string');
    expect(typeof mockRoomRepository.delete).toBe('function');
    expect(mockRoomRepository.delete(id)).resolves.toEqual({
      ok: true,
      message: expect.any(String),
    });
  });

  
});
