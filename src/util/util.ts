export const randomDate = (start: Date, end: Date) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };
  
export const defaultImage = 'https://www.nasa.gov/sites/default/files/styles/full_width_feature/public/thumbnails/image/5091372229_ebca868ffd_o.jpeg';