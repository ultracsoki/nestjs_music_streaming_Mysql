import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import * as mysql from 'mysql2';
import { AppService } from './app.service';
import { newMusicDTO } from './newMusicDTO';
import e, { Response } from 'express';
import { deleteMusicDTO } from './deleteMusicDTO';
import { modifyMusicDTO } from './modifyMusicDTO';

const conn = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'MusicStreaming',
}).promise();

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async index() {
    const [ adatok ] = await conn.execute('SELECT id, title, artist, length FROM zeneszamok ORDER BY artist, title');
    console.log(adatok);

    return {
       musics: adatok, 
      };
  }

  @Post('/deleteMusic')
  async deleteMusic (@Body() deleteMusicDTO: deleteMusicDTO, @Res() res: Response) 
  {
    const selectedId = deleteMusicDTO.id;
    const [ adatok ] = await conn.execute('DELETE FROM zeneszamok WHERE id = ?', [selectedId]);
    res.redirect('/');
  }

  @Get('/modifyMusic')
  @Render('modifyMusic')
  modifyMusic () 
  {
    return { messages: '' };
  }

  /*@Post('/newMusic')
  @Render('newMusic')
  async modifyMusic1(@Body() modifyMusicDTO: modifyMusicDTO, @Res() res: Response) {
    const selectedId = modifyMusicDTO.id;
    const [ adatok ] = await conn.execute('UPDATE zeneszamok SET title=?, artist=?, length=? WHERE id=?', [modifyMusicDTO.title,modifyMusicDTO.artist,modifyMusicDTO.length,selectedId]);
      const title = newMusic.title;
      const artist = newMusic.artist;
      const length = newMusic.length;
      if(title == "" || artist == "" || length.toString() == "") {
        return { messages: "Minden mezőt kötelező kitölteni!"};
      } else if (length < 0){
        return { messages: "Az életkor nem lehet negatív!"};
      } else {
        const [ adatok ] = await conn.execute('INSERT INTO zeneszamok (title, artist, length) VALUES (?, ?, ?)', [ 
          title,
          artist,
          length,
        ],
        );
        res.redirect('/');
      }
    }*/

  @Get('/newMusic')
  @Render('newMusic')
  newMusic() {
    return { messages: '' };
  }

  @Post('/newMusic')
  @Render('newMusic')
  async addNewMusic(@Body() newMusic: newMusicDTO, @Res() res: Response) {
      const title = newMusic.title;
      const artist = newMusic.artist;
      const length = newMusic.length;
      if(title == "" || artist == "" || length.toString() == "") {
        return { messages: "Minden mezőt kötelező kitölteni!"};
      } else if (length < 0){
        return { messages: "Az életkor nem lehet negatív!"};
      } else {
        const [ adatok ] = await conn.execute('INSERT INTO zeneszamok (title, artist, length) VALUES (?, ?, ?)', [ 
          title,
          artist,
          length,
        ],
        );
        res.redirect('/');
      }
    }
}
