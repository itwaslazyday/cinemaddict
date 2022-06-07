import AbstractView from '../framework/view/abstract-view.js';

const createSiteFooterTemplate = (amount) => (`<footer class="footer">
<section class="footer__logo logo logo--smaller">Cinemaddict</section>
  <section class="footer__statistics">
    <p>${amount} movies inside</p>
  </section>
</footer>`
);

export default class SiteFooterView extends AbstractView {
  #moviesAmount = null;

  constructor(moviesAmount) {
    super();
    this.#moviesAmount = moviesAmount;
  }

  get template() {
    return createSiteFooterTemplate(this.#moviesAmount);
  }
}
