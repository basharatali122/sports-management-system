import React from 'react';


import Masonry from './Masonry';
// Context
import { ThemeContext } from '../../context/ThemeContext';
// Assets
import img1 from "../../assets/1.jpg";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";
import img4 from "../../assets/4.jpg"
import img5 from "../../assets/5.jpg"
import img6 from "../../assets/6.jpg"

const MemorialData = () => {
  const items = [
    {
      id: "1",
      img: img1,
      url: "https://example.com/one",
      height: 400,
    },
    {
      id: "2",
      img: img2,
      url: "https://example.com/two",
      height: 250,
    },
    {
      id: "3",
      img: img3,
      url: "https://example.com/three",
      height: 600,
    },
    {
      id: "4",
      img: img4,
      url: "https://example.com/four",
      height: 450,
    },
    {
      id: "5",
      img: img5,
      url: "https://example.com/five",
      height: 500,
    },
    {
      id: "6",
      img: img6,
      url: "https://example.com/six",
      height: 420,
    },
    {
        id: "7",
        img: img1,
        url: "https://example.com/one",
        height: 400,
      },
      {
        id: "8",
        img: img2,
        url: "https://example.com/two",
        height: 250,
      },
      {
        id: "9",
        img: img3,
        url: "https://example.com/three",
        height: 600,
      },
      {
        id: "10",
        img: img4,
        url: "https://example.com/four",
        height: 450,
      },
      {
        id: "11",
        img: img5,
        url: "https://example.com/five",
        height: 500,
      },
      {
        id: "12",
        img: img6,
        url: "https://example.com/six",
        height: 420,
      }
  ];

  return (
    <div className='relative top-4'>
      <Masonry
        items={items}
        ease="power3.out"
        duration={0.6}
        stagger={0.05}
        animateFrom="bottom"
        scaleOnHover={true}
        hoverScale={0.95}
        blurToFocus={true}
        colorShiftOnHover={false}
      />
    </div>
  );
};

export default MemorialData;
