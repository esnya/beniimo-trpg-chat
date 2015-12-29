<div class="container">
	<table class="table">
		<thead>
			<th><?php echo __('Name'); ?></th>
			<th><?php echo __('Message'); ?></th>
			<th><?php echo __('Date/Time'); ?></th>
		</thead>
		<tbody>
			<?php foreach($messages as $message): ?>
			<tr>
				<td><?php echo h($message['Message']['name']); ?></td>
				<td><?php echo h($message['Message']['message']); ?></td>
				<td><?php echo h($message['Message']['modified']); ?></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	<div class="text-center">
		<div class="btn-group">
			<?php
				echo $this->Paginator->prev('<', null, null, array('class'=>'disabled', 'disabled' => 'disabled'));
				echo '|';
				echo $this->Paginator->numbers();
				echo '|';
				echo $this->Paginator->next('>', null, null, array('class'=>'disabled', 'disabled' => 'disabled'));
			?>
		</div>
		<div>
			<?php echo $this->Paginator->counter(); ?>
		</div>
	</div>
</div>
