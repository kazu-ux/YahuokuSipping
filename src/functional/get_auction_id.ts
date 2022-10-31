export const getAuctionId = () => {
  const auctionId = location.href.split('/')[5];
  return auctionId;
};
