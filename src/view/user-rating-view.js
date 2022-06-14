import AbstractView from '../framework/view/abstract-view.js';

const rating = {
  10: 'Novice',
  20: 'Fan',
  infinity: 'Movie Buff'
};

const defineUserRating = (count) =>{
  count = Math.ceil(count / 10) * 10;
  return count <= 20 ? rating[count] : rating.infinity;
};

const createUserRatingTemplate = (count) => `<section class="header__profile profile">
<p class="profile__rating">${defineUserRating(count)}</p>
<img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
</section>`;

export default class UserRatingView extends AbstractView {
  #count = null;

  constructor(count) {
    super();
    this.#count = count;
  }

  get template() {
    return createUserRatingTemplate(this.#count);
  }
}
