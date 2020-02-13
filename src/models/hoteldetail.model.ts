export class HotelDetail {

  public CheckInDate: string;
  public CheckOutDate: string;
  public RoomNumber: string;
  public Room: any;
  public Guest: string;
  public RoomsRequest: Array<RoomsRequest>;
  public HotelID: string;

}

export class RoomsRequest {
  public Adult: Adult;
}
export class Adult {
  public value: string;
}