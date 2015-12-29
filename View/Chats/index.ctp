<div class="container">
	<table class="table">
		<thead>
			<tr>
				<th></th>
				<th><?php echo __('Name'); ?></th>
				<th><?php echo __('Game Type'); ?></th>
				<th><?php echo __('Game Master'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php foreach($rooms as $room): ?>
			<tr>
				<td class="text-center">
					<div class="btn-group">
						<?php echo $this->Html->link(__('View'), ['action' => 'view', $room['Room']['id']], ['class' => 'btn btn-primary btn-xs']); ?>
					</div>
				</td>
				<td><?php echo h($room['Room']['name']); ?></td>
				<td><?php echo h($room['GameType']['name']); ?></td>
				<td><?php echo h($room['User']['name']); ?></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
</div>
