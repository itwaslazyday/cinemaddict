import AbstractView from '../framework/view/abstract-view.js';

const defineUserRating = (count) => {
  if (count <= 10) {
    return 'Novice';
  }

  if (count <= 20) {
    return 'Fan';
  }

  return 'Movie Buff';
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
