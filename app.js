function getRandomvalue(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyle() {
      if (this.monsterHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.monsterHealth + '%' };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: '0%' };
      }
      return { width: this.playerHealth + '%' };
    },
    disableSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = 'draw';
      } else if (value <= 0) {
        this.winner = 'monster';
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = 'draw';
      } else if (value <= 0) {
        this.winner = 'player';
      }
    },
  },
  methods: {
    startGame() {
      this.monsterHealth = 100;
      this.playerHealth = 100;
      this.currentRound = 0;
      this.winner = null;
    },
    attackMonster() {
      this.currentRound++;
      const score = getRandomvalue(5, 12);
      this.monsterHealth -= score;
      this.addLogMessage('player', 'attack', score);
      this.attackPlayer();
    },
    attackPlayer() {
      const score = getRandomvalue(8, 20);
      this.playerHealth -= score;
      this.addLogMessage('monster', 'attack', score);
    },
    specialAttackMonster() {
      this.currentRound++;
      const score = getRandomvalue(10, 25);
      this.monsterHealth -= score;
      this.attackPlayer();
      this.addLogMessage('player', 'special-attack', score);
    },
    healPlayer() {
      const score = getRandomvalue(8, 30);
      if (this.playerHealth + score > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += score;
      }
      this.attackPlayer();
      this.addLogMessage('player', 'heal', score);
    },
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount('#game');
