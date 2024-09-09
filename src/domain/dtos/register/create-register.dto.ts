export class CreateRegisterDto {
  constructor(
    public readonly guestsNumber: number,
    public readonly discount: number,
    public readonly price: number,
    public readonly userId: string,
    public readonly roomId: string,
    public readonly checkIn: string,
    public readonly checkOut?: string
  ) {}

  static create(props: Record<string, any>): CreateRegisterDto {
    const { guestsNumber, discount, price, userId, roomId, checkIn, checkOut } =
      props;

    return new CreateRegisterDto(
      +guestsNumber,
      +discount,
      +price,
      userId,
      roomId,
      checkIn,
      checkOut
    );
  }
}
