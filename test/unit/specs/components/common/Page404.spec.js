import { shallowMount } from "@vue/test-utils"
// import Page404 from "src/components/common/Page404"

describe(`Page404`, () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Page404, {
      stubs: [`router-link`]
    })
  })

  it.skip(`should show the 404 page`, async () => {
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  it.skip(`should show links to other pages`, () => {
    expect(wrapper.findAll(`router-link-stub`).length > 0).toBe(true)
  })
})
