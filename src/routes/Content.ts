import express, { RequestHandler } from 'express';
import { Image, Content } from '../models/Content';
import { NASA_API_KEY } from '../config/credentials';
import { randomDate, defaultImage } from '../util/util';
import fetch from 'node-fetch';

const getApodImageSrc = (retryCount = 0): Promise<Image> => {
    if (retryCount >= 3) {
      console.error("Too many retries.");
      return Promise.resolve({
        url: defaultImage,
      });
    }
  
    const date = randomDate(new Date(2015, 1, 1), new Date());
    const photoDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60 * 1000
    )
      .toISOString()
      .split("T")[0];
  
    return fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${photoDate}`
    )
      .then((response) => response.json())
      .then(({ url }: Partial<Image>) => {
        const isValid = !url.startsWith('https://www.youtube') && !url.startsWith('https://player.vimeo');
        if (isValid) {
          return { url };
        } else {
          return getApodImageSrc(retryCount + 1);
        }
      })
      .catch((err) => {
          console.error(`Failed to fetch apod image: ${err}`)
          return {} as Image;
      });
};

const getImage = async (): Promise<Image> => {
    return getApodImageSrc();
}

const getQuote = async (): Promise<string> => {
    return fetch("https://api.kanye.rest")
        .then((response) => response.json())
        .then(({ quote }) => quote as string)
        .catch((err) => {
            console.error(`Failed to fetch kanye quote: ${err}`);
            return err;
        });
}

const buildContent = async (): Promise<Content> => {
    const [ image, quote ] = await Promise.all([
        getImage(), getQuote()
    ]);

    return { image, quote };
}

const getContent: RequestHandler = async (request, response, next) => {
    const content: Content = await buildContent();
    response.locals.content = content;
    next(); 
}

const router = express.Router();
router.get('/', getContent, (request, response) => {
    if (response.locals.content)
        response.send(response.locals.content);
    else
        response.send('something went wrong');
});

export default router;