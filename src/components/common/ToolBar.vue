<template>
  <div class="tool-bar">
    <slot />
    <a v-if="session.signedIn" id="signOut-btn" @click="signOut()">
      <i v-tooltip.bottom.end="'Sign Out'" class="material-icons">
        exit_to_app
      </i>
    </a>
    <TmBtn
      id="sign-in"
      v-if="!session.signedIn"
      class="sign-in-button"
      value="Sign In"
      color="primary"
      @click.native="signIn()"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import TmBtn from "common/TmBtn"
export default {
  name: `tool-bar`,
  components: { TmBtn },
  props: {
    displayText: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([`session`])
  },
  methods: {
    signIn() {
      this.$router.push(`/welcome`)
    },
    signOut() {
      this.$store.dispatch(`signOut`)
      localStorage.setItem(`qraddress`,undefined)
      localStorage.setItem(`qramount`,undefined)
    }
  }
}
</script>
<style scoped>
.tool-bar {
  display: flex;
  align-items: center;
  /* max-height: 2rem; */
  justify-content: flex-end;
  width: 100%;
}

.sign-in-button {
  margin: 1rem 0 1rem 1rem;
}

.tool-bar i {
  padding: 0.5rem;
}

.tool-bar i,
.tool-bar a {
  color: var(--dim);
  font-size: var(--lg);
  display: flex;
  align-items: center;
}

.tool-bar i:hover {
  background: var(--app-nav);
  padding: 0.5rem;
  border-radius: 50%;
}

.tool-bar a:hover {
  cursor: pointer;
  color: var(--bright);
}
</style>
