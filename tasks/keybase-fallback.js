/* istanbul ignore file */ // not production script

const axios = require(`axios`)
const fs = require(`fs`)
const path = require(`path`)

const baseUrl = `https://keybase.io/_/api/1.0/user/lookup.json`
const fieldsQuery = `fields=pictures,basics`

export async function lookupId(state, keybaseId) {
  const fullUrl = `${baseUrl}?key_suffix=${keybaseId}&${fieldsQuery}`
  return query(state, fullUrl, keybaseId)
}
async function query(state, url, keybaseId) {
  try {
    const res = await state.externals.axios(url)
    return getKeybaseProfileFromResponse(keybaseId, res)
  } catch (error) {
    return {
      keybaseId
    }
  }
}

function getKeybaseProfileFromResponse(keybaseId, { data }) {
  if (data.status.name === `OK` && data.them[0]) {
    const user = data.them[0]
    return {
      keybaseId,
      avatarUrl:
        user.pictures && user.pictures.primary
          ? user.pictures.primary.url
          : undefined,
      userName: user.basics.username,
      profileUrl: `https://keybase.io/` + user.basics.username,
      lastUpdated: new Date(Date.now()).toUTCString()
    }
  }
}

function getValidators() {
  return Promise.all([
    axios(`https://proxy.mainbeta-3.color-platform.org:9061/staking/validators?status=unbonding`).then(
      res => res.data
    ),
    axios(`https://proxy.mainbeta-3.color-platform.org:9061/staking/validators?status=bonded`).then(
      res => res.data
    ),
    axios(`https://proxy.mainbeta-3.color-platform.org:9061/staking/validators?status=unbonded`).then(
      res => res.data
    )
  ]).then(validatorGroups => [].concat(...validatorGroups))
}

// This function creates a file with keybase profiles of all validators (as a fallback cache)
// This should be created on every build
async function main() {
  const validators = await getValidators()
  const cache = {}
  await Promise.all(
    validators.map(async validator => {
      const keybaseId = validator.description.identity
      let trys = 10
      while (trys > 0)
        try {
          const identity = await lookupId({ externals: { axios } }, keybaseId)
          if (identity) {
            cache[identity.keybaseId] = identity
          }
          console.log(
            `got ${Object.keys(cache).length} of ${
              validators.length
            } keybase identities`
          )
          break
        } catch (err) {
          await new Promise(resolve => setTimeout(resolve, 2000))
          trys--
        }
    })
  )

  if (Object.keys(validators).length === 0) {
    throw new Error("Keybase cache creation failed")
  }

  fs.writeFileSync(
    path.join(__dirname, `../src/keybase-cache.json`),
    JSON.stringify(cache),
    `utf8`
  )
}

main()
