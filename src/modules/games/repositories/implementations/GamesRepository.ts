import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder()
      .where("title ILIKE :title", { title: `%${param}%` })
      .getMany();

    return games
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const query = "SELECT COUNT (*) FROM games";

    const quantityOfGames = await this.repository.query(query);

    return quantityOfGames;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const users = await this.repository
      .createQueryBuilder("user_game")
      .relation(Game, "users")
      .of(id)
      .loadMany();
    
      return users
  }
}
