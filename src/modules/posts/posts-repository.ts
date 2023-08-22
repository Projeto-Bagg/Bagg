import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { DeletePostDto } from './dtos/delete-post.dto';
import { Post } from './entities/post.entity';

export abstract class PostsRepository {
  abstract create(createPostDto: CreatePostDto): Promise<void>;
  abstract findMany(): Promise<Post[]>;
  abstract findById(id: string): Promise<Post>;
  abstract update(UpdatePostDto: UpdatePostDto): Promise<void>;
  abstract delete(DeletePostDto: DeletePostDto): Promise<void>;
}
