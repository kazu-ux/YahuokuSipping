export const getAuctionId = () => {
  const auctionId = location.href.split('/')[5].split('?')[0];
  return auctionId;
};
