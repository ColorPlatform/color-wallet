<template>
  <div class="card">
    <div class="row">
      <div class="col-lg-12">
        <h3>Total {{ num.viewDenom(bondDenom) }}:</h3>
        <h2 class="total-atoms__value color">
          {{ totalAtomsDisplay | prettyLong }}
        </h2>
      </div>
    </div>
    <b-progress v-if="hidebar" class="mt-2" :max="max" show-value>
      <b-progress-bar
        :value="(num.atoms(liquidAtoms) * 100) / num.atoms(totalAtoms)"
        :label="
          `${((num.atoms(liquidAtoms) * 100) / num.atoms(totalAtoms)).toFixed(
            2
          )}%`
        "
        variant="success"
        animated
      ></b-progress-bar>
      <b-progress-bar
        :value="(num.atoms(oldBondedAtoms) * 100) / num.atoms(totalAtoms)"
        :label="
          `${(
            (num.atoms(oldBondedAtoms) * 100) /
            num.atoms(totalAtoms)
          ).toFixed(2)}%`
        "
        variant="warning"
        animated
      ></b-progress-bar>
      <b-progress-bar
        :value="(num.atoms(oldUnbondingAtoms) * 100) / num.atoms(totalAtoms)"
        :label="
          `${(
            (num.atoms(oldUnbondingAtoms) * 100) /
            num.atoms(totalAtoms)
          ).toFixed(2)}%`
        "
        variant="danger"
        animated
      ></b-progress-bar>
    </b-progress>
    <div class="row textalign">
      <div
        class="col-lg-3 col-md-6 col-sm-6 col-xs-12 alignment unbonded-atoms"
      >
        <h3>
          <p class="green"></p>
          Liquid {{ num.viewDenom(bondDenom) }}:
        </h3>
        <h2 class="color">{{ unbondedAtoms | prettyLong }}</h2>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 alignment">
        <h3>
          <p class="blue"></p>
          Delegated {{ num.viewDenom(bondDenom) }}:
        </h3>
        <h2 class="color">{{ delegated | prettyLong }}</h2>
      </div>
      <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 alignment">
        <h3>
          <p class="purple"></p>
          Pending {{ num.viewDenom(bondDenom) }}:
        </h3>
        <h2 class="color">{{ unbondingAtoms | prettyLong }}</h2>
      </div>
      <div
        v-if="rewards"
        class="col-lg-3 col-md-6 col-sm-6 col-xs-12 alignment display"
      >
        <h3 class="margintop">Available Rewards:</h3>
        <!-- <h2 class="color topleft">{{ rewards }}  -->
        <TmBtn
          id="withdraw-btn"
          :value="rewards"
          :disabled="!readyToWithdraw"
          :to="''"
          type="anchor"
          color="primary"
          class="withdrawbtn"
          @click.native="readyToWithdraw && onWithdrawal()"
        />
        <!-- </h2> -->
      </div>
    </div>
    <ModalWithdrawRewards
      ref="ModalWithdrawRewards"
      :rewards="totalRewards"
      :denom="bondDenom"
    />
  </div>
</template>
<script>
import num from "scripts/num"
import { mapGetters } from "vuex"
import { atoms as toAtoms, prettyLong } from "../../scripts/num.js"
import ModalWithdrawRewards from "src/ActionModal/components/ModalWithdrawRewards"
import TmBtn from "./TmBtn"
import "bootstrap/dist/css/bootstrap.css"

export default {
  name: `tm-balance`,
  components: { TmBtn, ModalWithdrawRewards },
  filters: {
    toAtoms,
    prettyLong
  },
  data() {
    return {
      num,
      lastUpdate: 0,
      value: 0,
      max: 100
    }
  },
  computed: {
    ...mapGetters([
      `connected`,
      `session`,
      `wallet`,
      `oldBondedAtoms`,
      `delegation`,
      `liquidAtoms`,
      `lastHeader`,
      `totalAtoms`,
      `bondDenom`,
      `distribution`,
      `validatorsWithRewards`,
      `totalRewards`,
      `oldUnbondingAtoms`,
      `committedDelegates`,
      `delegates`
    ]),
    loaded() {
      return this.wallet.loaded && this.delegation.loaded
    },
    hidebar() {
      return (
        this.num.atoms(this.totalAtoms) ||
        this.num.atoms(this.liquidAtoms) !== 0
      )
    },
    totalAtomsDisplay() {
      return this.loaded ? this.num.atoms(this.totalAtoms) : `--`
    },
    unbondedAtoms() {
      return this.loaded ? this.num.atoms(this.liquidAtoms) : `--`
    },
    unbondingAtoms() {
      return this.loaded ? this.num.atoms(this.oldUnbondingAtoms) : `--`
    },
    delegated() {
      return this.loaded ? this.num.atoms(this.oldBondedAtoms) : `--`
    },
    readyToWithdraw() {
      return this.totalRewards > 0
    },
    rewards() {
      if (!this.distribution.loaded) {
        return `--`
      }
      const rewards = this.totalRewards
      return this.num.fullDecimals(
        this.num.atoms(rewards && rewards > 10 ? rewards : 0)
      )
    }
    // LiquidbarValue() {
    //   if (this.num.atoms(this.totalAtoms) === 0)
    //     return 0
    //   else
    //     return (((this.num.atoms(this.liquidAtoms)) * 100) / (this.num.atoms(this.totalAtoms)))
    // }
  },
  watch: {
    lastHeader: {
      immediate: true,
      handler(newHeader) {
        const height = Number(newHeader.height)
        // run the update queries the first time and after every 10 blocks
        const waitedTenBlocks = height - this.lastUpdate >= 10
        if (
          this.session.signedIn &&
          (this.lastUpdate === 0 || waitedTenBlocks)
        ) {
          this.update(height)
        }
      }
    }
  },
  mounted() {
    this.totalAtoms
    this.oldBondedAtoms
    this.oldUnbondingAtoms
    this.committedDelegations
    this.delegates
  },
  methods: {
    update(height) {
      this.lastUpdate = height
      this.$store.dispatch(`getRewardsFromMyValidators`)
      this.$store.dispatch(`queryWalletBalances`)
      this.$store.dispatch(`updateDelegates`)
      this.totalAtoms
      this.oldBondedAtoms
      this.oldUnbondingAtoms
      this.committedDelegations
      this.delegates
    },
    onWithdrawal() {
      this.$refs.ModalWithdrawRewards.open()
    }
  }
}
</script>
<style scoped>
.mt-2.progress {
  margin: 1rem !important;
}

.header-balance {
  display: flex;
  padding: 1rem 0 2.5rem 1rem;
}

/* .display {
  display: contents
} */

.margintop {
  margin-top: 0.2rem !important;
}

h3 {
  color: black !important;
  font-size: 1rem !important;
  display: inline;

  /* line-height: 1.2; */
}

.topleft {
  margin-top: 0.2rem;
  margin-left: 0.3rem;
}

.textalign {
  text-align: left;
}

.withdrawbtn {
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
}

.col-md-4 {
  display: inline;
}

.progress {
  height: 1.5rem !important;
}

h2 {
  color: black !important;
  font-size: 1rem !important;
  display: inline;
  margin-bottom: 0.5rem;
  overflow: hidden;
  font-weight: 500;
}

.displayinline {
  display: inline-flex;
}

.bg-warning {
  background-color: #0974b1 !important;
}

.bg-danger {
  background-color: #9569ec !important;
}

.green {
  background-color: #28a745;
  width: 15px;
  height: 15px;
  display: -webkit-inline-box;
  margin: 0 5px 0 0;
}

.blue {
  background-color: #0974b1;
  width: 15px;
  height: 15px;
  display: -webkit-inline-box;
  margin: 0 5px 0 0;
}

.purple {
  background-color: #9569ec;
  width: 15px;
  height: 15px;
  display: -webkit-inline-box;
  margin: 0 5px 0 0;
}

.color {
  color: #0a73b1 !important;
}

p {
  margin-bottom: 0 !important;
  margin-top: 2px;
}

.total-atoms.top-section {
  padding-left: 0;
}

.header-balance .top {
  display: flex;
  flex-direction: row;
}

.top-section {
  position: relative;
  padding: 0 2rem;
}

.header-balance .top h3 {
  font-size: 14px;
  margin: 0;
  font-weight: 400;
  white-space: nowrap;
}

.header-balance .top h2 {
  color: var(--bright);
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 40px;
}

.withdraw-rewards {
  font-size: var(--sm);
  font-weight: 500;
}

.second-row {
  flex-direction: row;
  display: flex;
}

@media screen and (max-width: 867px) {
  .col-md-4 {
    display: flex;
    max-width: none;
  }
}

@media screen and (max-width: 768px) {
  .display {
    display: block;
  }
}

@media screen and (max-width: 575px) {
  .alignment {
    text-align: left;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
}

/* TODO fix scaling on medium sized screens and pick proper break point */
@media screen and (max-width: 550px) {
  .header-balance {
    padding: 0;
  }

  .top-section {
    padding: 0.5rem 0 1rem;
  }

  .header-balance .top {
    flex-direction: column;
    width: 100%;
  }

  .second-row {
    width: 100%;
    justify-content: space-between;
  }
}

@media screen and (max-width: 320px) {
  .withdrawbtn {
    margin-left: 0 !important;
  }
}
</style>
