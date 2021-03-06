import { shallowMount } from "@vue/test-utils"
import LiGovTransaction from "transactions/LiGovTransaction"
import { governanceTxs } from "../../store/json/txs"

describe(`LiGovTransaction`, () => {
  let wrapper
  const propsData = {
    url: `/proposals`,
    bondingDenom: `clr`,
    fees: {
      amount: `3421`,
      denom: `uclr`
    },
    tx: {},
    txType: ``,
    time: new Date(Date.now()).toISOString(),
    block: 500,
    memo: `TESTING (Sent via Color Wallet)`
  }

  beforeEach(() => {
    wrapper = shallowMount(LiGovTransaction, {
      propsData,
      stubs: [`router-link`]
    })
  })

  it(`proposals`, () => {
    wrapper.setProps({
      tx: governanceTxs[0].tx.value.msg[0].value,
      txType: `color/MsgSubmitProposal`
    })
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it(`deposits`, () => {
    wrapper.setProps({
      tx: governanceTxs[1].tx.value.msg[0].value,
      txType: `color/MsgDeposit`
    })
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it(`votes`, () => {
    wrapper.setProps({
      tx: governanceTxs[2].tx.value.msg[0].value,
      txType: `color/MsgVote`
    })
    expect(wrapper.vm.$el).toMatchSnapshot()
  })
})
