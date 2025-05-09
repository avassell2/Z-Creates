const dummyComics = [
  {
    id: 1,
    title: "Dragon Ball",
    description: "This is the first comic.",
    thumbnail: require('./images/dbvol7.jpg'),
    coverImage: require('./images/dbvol7.jpg'),
    chapters: [
      { id: 101, title: "Chapter 1", pages: [require('./images/series/DragonBall/ch1/page1.png'), require('./images/series/DragonBall/ch1/page2.png')] },
      { id: 102, title: "Chapter 2" },
    ],
  },
  {
    id: 2,
    title: "Hellsing",
    description: "This is the second comic.",
    thumbnail: require('./images/hellsingcover.jpg') ,
    coverImage: require('./images/hellsingcover.jpg'),
    chapters: [
      { id: 201, title: "Chapter 1" },
      { id: 202, title: "Chapter 2" },
    ],
  },
];
export default dummyComics;