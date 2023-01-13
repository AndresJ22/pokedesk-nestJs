
import { Injectable } from '@nestjs/common';
// import axios,{ AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Pokemon } from '../pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
 // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http:AxiosAdapter
  ) { }

  async executeSeed() {
    try {
      await this.pokemonModel.deleteMany({});
      const data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
      const pokemonToInsert:{name:string,no:number}[] = [];
      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const no = +segments[segments.length - 2];
        // await this.pokemonModel.create({ name, no });
        pokemonToInsert.push({name,no});
      });
      this.pokemonModel.insertMany(pokemonToInsert);
      return 'Seed executed'
    } catch (error) {
      console.log(error);
    }
  }

  
}
