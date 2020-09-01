import { Model } from "../Model";
import { Column } from "../../";

export class Moderation extends Model {
  @Column({ primary: true, nullable: false })
  public guild: string;

  @Column({ primary: true, nullable: false })
  public case: number;

  @Column()
  public user: string;

  @Column()
  public moderator: string;

  @Column()
  public type: string;

  @Column()
  public duration: number | null;

  @Column()
  public reason: string;

  @Column()
  public date: Date;
}
