import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

class ConstructableBaseEntity extends BaseEntity {
  static construct<T>(this: new () => T, params: Partial<T>): T {
    return Object.assign(new this(), params);
  }
}

export interface QuestionDescriptor {
  questionText: string;
  questionNumber: number;
  positiveAnswer: string;
  negativeAnswer: string;
  positiveFormulation: string;
  negativeFormulation: string;
}

@Entity()
export class Question
  extends ConstructableBaseEntity
  implements QuestionDescriptor
{
  @PrimaryColumn("int")
  questionNumber: number;

  @Column("text")
  questionText: string;

  @Column("text")
  positiveAnswer: string;

  @Column("text")
  negativeAnswer: string;

  @Column("text")
  positiveFormulation: string;

  @Column("text")
  negativeFormulation: string;

  @Column("int", { default: 0 })
  votesPositive: number;

  @Column("int", { default: 0 })
  votesNegative: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
