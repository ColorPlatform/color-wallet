import { shallowMount } from "@vue/test-utils"
// import TmSessionExisting from "common/TmSessionExisting"

describe(`TmSessionExisting`, () => {
  let wrapper, $store

  beforeEach(() => {
    const getters = {
      session: {
        insecureMode: false,
        browserWithLedgerSupport: null
      },
      keystore: {
        accounts: []
      },
      lastPage: `/`
    }
    $store = {
      getters,
      commit: jest.fn(),
      dispatch: jest.fn()
    }
    wrapper = shallowMount(TmSessionExisting, {
      mocks: {
        $store
      },
      stubs: [`router-link`]
    })
  })

  describe(`default view in production`, () => {
    it.skip(`shows "Explore with any address"`, () => {
      expect(wrapper.find(`#explore-with-address`).exists()).toBe(true)
    })

    it.skip(`shows "Use Ledger Nano"`, () => {
      expect(wrapper.find(`#use-ledger-nano`).exists()).toBe(true)
    })
  })

  describe(`insecure mode in production`, () => {
    it.skip(`shows "Recover with backup code"`, () => {
      wrapper.vm.session.insecureMode = true
      expect(wrapper.find(`#recover-with-backup`).exists()).toBe(true)
    })
  })

  describe(`insecure mode with an existing account`, () => {
    it.skip(`shows "Sign in with account"`, () => {
      wrapper.vm.session.insecureMode = true
      wrapper.vm.keystore.accounts = [`account1`]

      expect(wrapper.find(`#sign-in-with-account`).exists()).toBe(true)
    })
  })
})
