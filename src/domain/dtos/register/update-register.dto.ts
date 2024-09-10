export class UpdateRegisterDto {
  constructor(
    public readonly id: string,
    public readonly guestsNumber?: number,
    public readonly discount?: number,
    public readonly price?: number,
    public readonly userId?: string,
    public readonly roomId?: string,
    public readonly checkIn?: Date,
    public readonly checkOut?: Date
  ) {}

  static create(props: Record<string, any>): UpdateRegisterDto {
    const {
      id,
      guestsNumber,
      discount,
      price,
      userId,
      roomId,
      checkIn,
      checkOut,
    } = props;

    return new UpdateRegisterDto(
      id,
      +guestsNumber,
      +discount,
      +price,
      userId,
      roomId,
      checkIn ? new Date(checkIn) : undefined,
      checkOut ? new Date(checkOut) : undefined
    );
  }
}