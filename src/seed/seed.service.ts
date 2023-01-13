
import { Injectable } from '@nestjs/common';
import axios,{ AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async executeSeed() {
    try {
      await this.pokemonModel.deleteMany({});
      const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
      const insertPromisesArray: Promise<any>[] = [];
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
        // await this.pokemonModel.create({ name, no });
        insertPromisesArray.push(this.pokemonModel.create({ name, no })
        );
      });

      await Promise.all(insertPromisesArray);
      return data.results;
    } catch (error) {
      console.log(error);
    }
  }

  
}
