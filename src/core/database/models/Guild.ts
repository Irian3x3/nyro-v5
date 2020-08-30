import { Model } from "../Model";
import { Column } from "../../";

export class Guild extends Model {
  @Column({ primary: true, nullable: false })
  public id: string;

  @Column({ defaults: "{}" })
  public data: string;
}
