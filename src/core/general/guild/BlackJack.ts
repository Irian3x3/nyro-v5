interface Player {
  id: number;
  cards: Card[];
  value: number;
  split: number;
}

interface Card {
  type: string;
  value: number;
}

const cards = [
  "Spades",
  "Hearts",
  "Diamonds",
  "Clubs",
  "Ace",
  "Queen",
  "Jester",
  "King",
];

export class BlackJack {
  public players: Player[] = [];

  public startGame() {
    for (let i = 0; i < 2; i++) {
      this.players[i] = {
        id: i,
        cards: [],
        value: 0,
        split: 0,
      };

      this.players[i].cards = this.addCard();

      this.players[i].cards.map(
        (card) => (this.players[i].value += card.value)
      );
    }

    return this.players;
  }

  public move(action: "hit" | "end" | "stay" | "split") {
    if (action === "end") return;

    switch (action) {
      case "split":
        if (this.players[0].split >= 2) return null;
        this.players[0].split += 1;

        const toAdd = this.addCard();
        this.players[0].cards.push(...toAdd);

        break;

      case "stay":
        const newCard = this.addCard()[0];
        this.players[1].cards.push(newCard);
        this.players[1].value += newCard.value;

        break;

      case "hit":
        const card = this.addCard();

        card.map((card, index) => {
          this.players[index].cards.push(card);
          this.players[index].value += card.value;
        });
        break;
    }

    return this.checkWin();
  }

  private checkWin() {
    const player = this.players[0];
    const dealer = this.players[1];

    if ((player.value && dealer.value) === 21) return "tie";
    if (player.value > 21) return "bust";

    if (player.value < 21 && dealer.value === 21) return "lost";

    if (player.value === 21 || (player.value <= 21 && dealer.value > 21))
      return "won";
  }

  private addCard(): Card[] {
    const c = [];

    for (let i = 0; i < 2; i++) {
      let value = Math.floor(Math.random() * 9) + 2;

      const type = this.shuffle(cards)[
        Math.floor(Math.random() * cards.length)
      ];
      if (["King", "Queen", "Jester", "Ace"].includes(type)) value = 10;

      if (type === "Ace") value = 11;

      c.push({
        value,
        type,
      });
    }

    return c;
  }

  private shuffle(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }
}
