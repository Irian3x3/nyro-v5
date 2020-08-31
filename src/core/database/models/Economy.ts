import { Model } from "../Model";
import { Column } from "../../";

export class Economy extends Model {
  @Column({ primary: true })
  public user: string;

  @Column({ primary: true })
  public guild: string;

  @Column({ defaults: 0 })
  public wallet: number;

  @Column({ defaults: 0 })
  public bank: number;
}
