/** Entidade pura: nenhuma dependência de framework, banco ou HTTP. */
export type TaskStatus = "todo" | "doing" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface TaskProps {
  id: number;
  userId: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

export type TaskChanges = Partial<Pick<TaskProps, "title" | "description" | "status" | "priority">>;

export class Task {
  private constructor(private readonly props: TaskProps) {}

  static restore(props: TaskProps): Task {
    return new Task({ ...props });
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  belongsTo(userId: number): boolean {
    return this.props.userId === userId;
  }

  /** Aplica alterações parciais e devolve uma nova instância (imutável). */
  withChanges(changes: TaskChanges): Task {
    const defined = Object.fromEntries(Object.entries(changes).filter(([, v]) => v !== undefined));
    return new Task({ ...this.props, ...defined });
  }

  toJSON() {
    const { userId: _userId, ...publicFields } = this.props;
    return publicFields;
  }

  get data(): Readonly<TaskProps> {
    return this.props;
  }
}
