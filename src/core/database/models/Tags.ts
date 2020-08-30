import { Model } from "../Model";
import { Column } from "../../";

export class Tags extends Model {
  @Column({ primary: true, nullable: false })
  public guild: string;

  @Column({ primary: true, nullable: false })
  public name: string;

  @Column()
  public content: string;

  @Column()
  public author: string;

  @Column()
  public editedby: string;

  @Column()
  public createdat: Date;

  @Column()
  public editedat: Date;

  @Column({ defaults: 1 })
  public uses: number;
}
