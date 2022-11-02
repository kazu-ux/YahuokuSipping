import { AuctionPage } from './content_scripts/auction_page';
import { bidWindow } from './content_scripts/bidWindow';
import './css/style.css';

const main = async () => {
  await AuctionPage();
  bidWindow();
};

//HTMLの読み込みが完了してから
window.addEventListener('load', main);

export {};
