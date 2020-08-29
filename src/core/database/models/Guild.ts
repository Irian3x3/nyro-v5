import { Model } from "../Model";
import { Column, InitModel } from "../../";

@InitModel("guild")
export class Guild extends Model {
  @Column({ primary: true, nullable: false })
  public id: string;

  @Column({ defaults: "{}" })
  public data: string;
}
