import { ethers } from 'hardhat'
import { expect } from 'chai'
import type { CheeseChain } from '../types/CheeseChain'

const Role = {
  ViewOnly: 0,
  Basic: 1,
  Laboratory: 2,
  MilkProducer: 3,
}

const coordinates = {
  longitude: '1',
  latitude: '1',
}

const description = 'test step'

describe('Cheese Chain', function () {
  let cheeseChain: CheeseChain
  let newLotId: number
  let admin: any
  let lab: any
  let basic: any
  let viewOnly: any
  let milk: any
  let dummy: any

  beforeEach(async () => {
    // get accounts
    ;[admin, lab, basic, viewOnly, milk, dummy] = await ethers.getSigners()

    // admin is automatically registered
    const CheeseChain = await ethers.getContractFactory('CheeseChain', admin)
    cheeseChain = (await CheeseChain.deploy()) as CheeseChain
    await cheeseChain.deployed()

    await cheeseChain.addParticipant({
      name: 'Example Laboratory',
      role: Role.Laboratory,
      owner: lab.address,
    })

    await cheeseChain.addParticipant({
      name: 'Example Basic',
      role: Role.Basic,
      owner: basic.address,
    })

    await cheeseChain.addParticipant({
      name: 'Example ViewOnly',
      role: Role.ViewOnly,
      owner: viewOnly.address,
    })

    await cheeseChain.addParticipant({
      name: 'Example Milk Producer',
      role: Role.MilkProducer,
      owner: milk.address,
    })
  })

  //role tests
  it('Should check if roles are correct', async () => {
    const isBasic = await cheeseChain.isBasicParticipant(basic.address)
    const basicIsLab = await cheeseChain.isLaboratory(basic.address)
    const basicIsAdmin = await cheeseChain.isAdministrator(basic.address)

    const isAdmin = await cheeseChain.isAdministrator(admin.address)
    const adminIsBasic = await cheeseChain.isBasicParticipant(admin.address)
    const adminIsLab = await cheeseChain.isLaboratory(admin.address)

    const isLab = await cheeseChain.isLaboratory(lab.address)
    const labIsBasic = await cheeseChain.isBasicParticipant(lab.address)
    const labIsAdmin = await cheeseChain.isAdministrator(lab.address)

    expect(isBasic && isAdmin && isLab).to.equal(true)
    expect(
      basicIsLab ||
        basicIsAdmin ||
        adminIsBasic ||
        adminIsLab ||
        labIsBasic ||
        labIsAdmin,
    ).to.equal(false)
  })

  // addParticipant tests
  it('Should revert on addParticipant() from basic/lab/view', async () => {
    const testParticipant = {
      name: 'Test',
      role: Role.Basic,
      owner: dummy.address,
    }

    await expect(cheeseChain.connect(basic).addParticipant(testParticipant)).to
      .be.reverted

    await expect(cheeseChain.connect(lab).addParticipant(testParticipant)).to.be
      .reverted

    await expect(cheeseChain.connect(viewOnly).addParticipant(testParticipant))
      .to.be.reverted
  })

  it('Should addParticipant()', async () => {
    const newParticipant = {
      name: 'New Participant',
      role: Role.Basic,
      owner: dummy.address,
    }
    // participant was not there before adding
    const emptySlot = await cheeseChain
      .connect(admin)
      .participants(dummy.address)
    expect(emptySlot.owner === ethers.constants.AddressZero)

    //adding participant
    await cheeseChain.connect(admin).addParticipant(newParticipant)

    // participant is there after adding
    const newParticipantAddress = await cheeseChain
      .connect(admin)
      .participants(dummy.address)
    expect(newParticipant.owner === newParticipantAddress)
  })

  it('Should not add the same participant address twice', async () => {
    const testParticipant = {
      name: 'Duplicated Address',
      role: Role.Basic,
      owner: basic.address,
    }

    await expect(cheeseChain.connect(admin).addParticipant(testParticipant)).to
      .be.reverted
  })

  it('Should revert when adding a 0 address to a participant', async () => {
    const testParticipant = {
      name: 'Duplicated Address',
      role: Role.Basic,
      owner: ethers.constants.AddressZero,
    }

    await expect(cheeseChain.connect(admin).addParticipant(testParticipant)).to
      .be.reverted
  })

  // changeParticipantRole
  it('Should revert unauthorized changeParticipantRole()', async () => {
    await expect(
      cheeseChain
        .connect(basic)
        .changeParticipantRole(viewOnly.address, Role.Basic),
    ).to.be.reverted
    await expect(
      cheeseChain
        .connect(lab)
        .changeParticipantRole(viewOnly.address, Role.Basic),
    ).to.be.reverted
    await expect(
      cheeseChain
        .connect(viewOnly)
        .changeParticipantRole(viewOnly.address, Role.Basic),
    ).to.be.reverted
  })

  it('Should change role', async () => {
    // role before change
    const roleBefore = (
      await cheeseChain.connect(admin).participants(viewOnly.address)
    ).role

    // role change to laboratory
    await cheeseChain
      .connect(admin)
      .changeParticipantRole(viewOnly.address, Role.Basic)

    // role after change
    const roleAfter = (
      await cheeseChain.connect(admin).participants(viewOnly.address)
    ).role

    expect(roleBefore !== roleAfter)
    expect(roleBefore === Role.ViewOnly)
    expect(roleAfter === Role.Basic)
  })

  // removeParticipant tests
  it('Should revert on removeParticipant() from basic/lab', async () => {
    await expect(cheeseChain.connect(basic).removeParticipant(viewOnly.address))
      .to.be.reverted
    await expect(cheeseChain.connect(lab).removeParticipant(viewOnly.address))
      .to.be.reverted
  })

  it("Should revert on removeParticipant() if participant doesn't exist", async () => {
    await expect(cheeseChain.connect(admin).removeParticipant(dummy.address)).to
      .be.reverted
  })

  it('Should removeParticipant()', async () => {
    // participant is there before removal
    const participantAddress = await cheeseChain
      .connect(admin)
      .participants(viewOnly.address)
    expect(participantAddress.owner !== ethers.constants.AddressZero)

    // participant is gone after removal
    await cheeseChain.connect(admin).removeParticipant(viewOnly.address)
    const removedParticipant = await cheeseChain
      .connect(admin)
      .participants(viewOnly.address)
    expect(removedParticipant.owner === ethers.constants.AddressZero)
  })

  it('Should revert if unauthorized role calls addMilkBatch()', async function () {
    await expect(
      cheeseChain.connect(basic).addMilkBatch({ longitude: '', latitude: '' }),
    ).to.be.revertedWith('This function is only callable by a milk producer!')
  })

  it('Should add a new milkBatch', async function () {
    const added = await cheeseChain
      .connect(milk)
      .addMilkBatch({ longitude: '', latitude: '' })
    const events = (await added.wait()).events
    const event = events?.find((event) => event.event === 'NewMilkBatch')
    const newBatchId = event?.args?._milkBatchId.toNumber()
    expect(await cheeseChain.totalBatches()).to.equal(newBatchId)
  })

  //addLot() tests
  it('Should revert addLot() when not called by admin or basic', async function () {
    cheeseChain.addMilkBatch(coordinates)
    await expect(cheeseChain.connect(lab).addLot([1])).to.be.revertedWith(
      'Msg.sender is not basic or admin',
    )
  })

  it('Should revert addLot() when called with unexistant batchId', async function () {
    await cheeseChain.addMilkBatch(coordinates)
    await expect(cheeseChain.connect(basic).addLot([2])).to.be.revertedWith(
      'Please provide only existing milk batch identifiers',
    )
  })

  it('Should revert addLot() when called with empty array', async function () {
    await expect(cheeseChain.connect(basic).addLot([])).to.be.revertedWith(
      'Please provide at least one milk batch identifier!',
    )
  })

  it('Should increase totalLots on addLot() by admin or basic', async function () {
    await cheeseChain.addMilkBatch(coordinates)
    const added = await cheeseChain.connect(admin).addLot([1])
    const events = (await added.wait()).events
    const event = events?.find((event) => event.event === 'LotAdded')
    newLotId = event?.args?._lotId.toNumber()
    expect(await cheeseChain.totalLots()).to.equal(newLotId)

    const addedByBasic = await cheeseChain.connect(admin).addLot([1])
    const eventsByBasic = (await addedByBasic.wait()).events
    const eventByBasic = eventsByBasic?.find(
      (event) => event.event === 'LotAdded',
    )
    let newLotIdByBasic = eventByBasic?.args?._lotId.toNumber()
    expect(await cheeseChain.totalLots()).to.equal(newLotIdByBasic)
  })

  /*// maybe todo revert unauthorized removeLot
  it("Should revert unauthorized remobeLot()");
  // maybe todo autorized removeLot
  it("Should removeLot()");*/

  //addStep() tests
  it('Should revert addStep() when caller not authorized (lab/viewOnly)', async () => {
    await cheeseChain.addMilkBatch(coordinates)
    const added = await cheeseChain.connect(admin).addLot([1])
    await added.wait()

    await expect(cheeseChain.connect(lab).addStep(1, description, coordinates))
      .to.be.reverted
    await expect(
      cheeseChain.connect(viewOnly).addStep(1, description, coordinates),
    ).to.be.reverted
  })

  it('Should increase totalSteps and lastStep on LotNr 1', async function () {
    // lot with id 1 is added
    await cheeseChain.addMilkBatch(coordinates)
    await cheeseChain.addLot([1])
    const added = await cheeseChain.addStep(newLotId, 'test step', {
      latitude: '1',
      longitude: '1',
    }) //add step to Lot #1
    const events = (await added.wait()).events
    const event = events?.find((event) => event.event === 'StepAdded')
    const stepId = event?.args?._stepId.toNumber()
    expect(await cheeseChain.totalSteps()).to.equal(stepId)
    const lot = await cheeseChain.lots(newLotId)
    expect(lot.lastStep.toNumber()).to.equal(stepId)
  })

  it('Should revert addStep() when lot does not exist', async () => {
    await expect(
      cheeseChain.connect(admin).addStep(1, description, coordinates),
    ).to.be.reverted
  })

  /*// maybe todo revert unauthorized removeStep
  it("Should revert unauthorized removeStep");

  // maybe todo authorized removeStep
  it("Should removeStep()");*/

  //lab result tests
  it('Should initiate lab results on addLot()', async function () {
    await cheeseChain.addMilkBatch(coordinates)
    await cheeseChain.addLot([1])
    const lot = await cheeseChain.lots(newLotId)
    expect(lot.testResult.result).to.equal(false)
    expect(lot.testResult.timestamp.toNumber()).to.equal(0)
  })

  it('Should accept positive lab result', async function () {
    await cheeseChain.addLabResult(1, true)
    const lot = await cheeseChain.lots(1)
    expect(lot.testResult.result).to.equal(true)
    expect(lot.testResult.timestamp).to.not.equal(0)
  })

  it('Should accept negative lab result', async function () {
    await cheeseChain.addLabResult(1, false)
    const lot = await cheeseChain.lots(1)
    expect(lot.testResult.result).to.equal(false)
    expect(lot.testResult.timestamp).to.not.equal(0)
  })
})
