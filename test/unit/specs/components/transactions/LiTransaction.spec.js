import { mount } from "@vue/test-utils"
import LiTransaction from "transactions/LiTransaction"

describe(`LiTransaction`, () => {
  let wrapper
  const propsData = {
    color: `#FFFFFF`,
    time: new Date(Date.now()).toISOString(),
    block: 500,
    // memo: `TESTING (Sent via Color Wallet)`,
    fees: {
      amount: `3421`,
      denom: `uclr`
    }
  }
  const day = 86400000

  beforeEach(() => {
    wrapper = mount(LiTransaction, {
      propsData,
      slots: {
        caption: `<span>Some Caption</span>`,
        details: `<span>Some Details</span>`
      },
      stubs: [`router-link`]
    })
  })

  it.skip(`should show a transaction item`, () => {
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it(`Should print the hour only if the same day`, () => {
    expect(
      LiTransaction.computed.date({ time: new Date(Date.now()).toISOString() })
    ).toEqual(`Jan 1st 1970, 00:00:42am UTC`)
  })

  it.skip(`should show a network fee`, () => {
    expect(wrapper.text()).toContain(`0.003`)
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it.skip(`should show a network fee of 0`, () => {
    wrapper.setProps({
      // fees: {
      //   amount: "0",
      //   denom: "uclr"
      // }
    })
    // Non breaking space present before fee value
    // eslint-disable-next-line no-irregular-whitespace
    expect(wrapper.text()).toContain(`Some Caption Some Details  
        Tx Hash # 
         check Copied 
        Network Fee: 
        0.003421 CLR Block #500  
       Jan 1st 1970, 00:00:42am UTC`)
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it(`Should print the datetime if we are in a different day`, () => {
    expect(
      LiTransaction.computed.date({
        time: new Date(Date.now() - day * 2).toISOString()
      })
    ).toEqual(`Dec 30th 1969, 00:00:42am UTC`)
  })
})
