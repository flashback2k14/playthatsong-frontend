import { PlaythatsongFrontendPage } from './app.po';

describe('playthatsong-frontend App', function() {
  let page: PlaythatsongFrontendPage;

  beforeEach(() => {
    page = new PlaythatsongFrontendPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
